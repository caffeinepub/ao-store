import { useState } from 'react';
import { useAddProduct } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export default function AddProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const addProduct = useAddProduct();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !price || !imageFile) {
      toast.error('Please fill in all fields and select an image');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await addProduct.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        image: blob,
      });

      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      setUploadProgress(0);
      toast.success('Product added successfully!');
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error('Failed to add product. Please try again.');
    }
  };

  const isUploading = addProduct.isPending && uploadProgress > 0 && uploadProgress < 100;

  return (
    <Card className="border-sage/20">
      <CardHeader>
        <CardTitle className="text-terracotta">Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
              disabled={addProduct.isPending}
              className="border-sage/30 focus:border-terracotta"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              required
              disabled={addProduct.isPending}
              rows={4}
              className="border-sage/30 focus:border-terracotta"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
              disabled={addProduct.isPending}
              className="border-sage/30 focus:border-terracotta"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={addProduct.isPending}
                className="border-sage/30 focus:border-terracotta"
              />
              {imageFile && <Upload className="w-5 h-5 text-sage" />}
            </div>
            {imageFile && (
              <p className="text-sm text-muted-foreground">Selected: {imageFile.name}</p>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Label>Upload Progress</Label>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">{uploadProgress}%</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={addProduct.isPending || !imageFile}
            className="w-full bg-terracotta hover:bg-terracotta-dark text-white"
          >
            {addProduct.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isUploading ? 'Uploading...' : 'Adding Product...'}
              </>
            ) : (
              'Add Product'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
