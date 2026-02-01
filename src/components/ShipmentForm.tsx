import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  truck_id: z.string().min(1, "Truck ID is required").max(50, "Truck ID must be less than 50 characters"),
  truck_city: z.string().min(1, "Truck city is required").max(100, "City name must be less than 100 characters"),
  crops: z.string().min(1, "Please enter the crops loaded"),
  warehouse_city: z.string().min(1, "Warehouse city is required").max(100, "City name must be less than 100 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

export type ShipmentFormData = z.infer<typeof formSchema>;

interface ShipmentFormProps {
  onSubmit: (data: ShipmentFormData) => Promise<void>;
  isLoading: boolean;
}

export function ShipmentForm({ onSubmit, isLoading }: ShipmentFormProps) {
  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      truck_id: "",
      truck_city: "",
      crops: "",
      warehouse_city: "",
      email: "",
    },
  });

  const handleSubmit = async (data: ShipmentFormData) => {
    await onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipment Data
        </CardTitle>
        <CardDescription>
          Enter the details of your crop shipment to assess spoilage risk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Vehicle & Cargo Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Vehicle & Cargo
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="truck_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Truck ID *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., TRUCK_001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="truck_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Truck City *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Delhi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="crops"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crops Loaded *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Apple, Tomato, Potato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Warehouse Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Warehouse Details
              </h3>
              <FormField
                control={form.control}
                name="warehouse_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warehouse City *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Delhi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            {/* Alert Contacts Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Alert Contacts
              </h3>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alert Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="manager@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Risk...
                </>
              ) : (
                "Assess Spoilage Risk"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
