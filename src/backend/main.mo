import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    image : Storage.ExternalBlob;
  };

  module MyProduct {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  type OrderData = {
    id : Nat;
    customer : Principal;
    products : [OrderedProduct];
    total : Float;
    status : OrderStatus;
  };

  module MyOrder {
    public func compare(order1 : OrderData, order2 : OrderData) : Order.Order {
      Nat.compare(order1.id, order2.id);
    };

    public func compareByCustomer(order1 : OrderData, order2 : OrderData) : Order.Order {
      Principal.compare(order1.customer, order2.customer);
    };
  };

  type OrderedProduct = {
    product : Product;
    quantity : Nat;
  };

  type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
  };

  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, OrderData>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextProductId = 1;
  var nextOrderId = 1;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Float, image : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let product : Product = {
      id = nextProductId;
      name;
      description;
      price;
      image;
    };

    products.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  public query func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public shared ({ caller }) func placeOrder(orderedProducts : [OrderedProduct]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let total = orderedProducts.foldRight(
      0.0,
      func(op, acc) { acc + (op.product.price * op.quantity.toFloat()) }
    );

    let order : OrderData = {
      id = nextOrderId;
      customer = caller;
      products = orderedProducts;
      total;
      status = #pending;
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order.id;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [OrderData] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort();
  };

  public query ({ caller }) func getCustomerOrders() : async [OrderData] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };

    let filteredOrders = List.empty<OrderData>();

    for (order in orders.values()) {
      if (order.customer == caller) {
        filteredOrders.add(order);
      };
    };

    filteredOrders.toArray().sort(MyOrder.compareByCustomer);
  };
};
