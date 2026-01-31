import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  truck_id: z.string().min(1, "Truck ID is required").max(50, "Truck ID must be less than 50 characters"),
  crops: z.string().min(1, "Please select a crop type"),
  warehouse_city: z.string().min(1, "Warehouse city is required").max(100, "City name must be less than 100 characters"),
  warehouse_temperature: z.string().optional(),
  warehouse_humidity: z.string().optional(),
  transport_type: z.string().min(1, "Please select transport type"),
  transport_duration_days: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  whatsapp_number: z.string().optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
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
      crops: "",
      warehouse_city: "",
      warehouse_temperature: "",
      warehouse_humidity: "",
      transport_type: "",
      transport_duration_days: "",
      email: "",
      whatsapp_number: "",
      notes: "",
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
                  name="crops"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crops Loaded *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="tomato">Tomato</SelectItem>
                          <SelectItem value="potato">Potato</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Warehouse Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Warehouse Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="warehouse_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warehouse City *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="warehouse_temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature (°C)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 24.7" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="warehouse_humidity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Humidity (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" placeholder="e.g., 78" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Transport Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Transport Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="transport_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transport Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transport type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ambient">Unrefrigerated (Ambient)</SelectItem>
                          <SelectItem value="refrigerated">Refrigerated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transport_duration_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Duration (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.5" placeholder="e.g., 1.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Alert Contacts Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Alert Contacts
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
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
                <FormField
                  control={form.control}
                  name="whatsapp_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91XXXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Notes Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Additional Information
              </h3>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special handling or observations"
                        className="resize-none"
                        {...field}
                      />
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
