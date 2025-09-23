import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function RecentSalesReport() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sales data based on date range
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API call
        // const response = await fetch(`/api/sales?startDate=${date?.from?.toISOString()}&endDate=${date?.to?.toISOString()}`);
        // const data = await response.json();
        // setSales(data);
        
        // Mock data for demonstration
        setTimeout(() => {
          setSales([
            { id: 1, property: 'Beachfront Villa', agent: 'John Doe', price: 250000, date: new Date() },
            { id: 2, property: 'City Apartment', agent: 'Jane Smith', price: 180000, date: new Date() },
            { id: 3, property: 'Mountain Cabin', agent: 'Mike Johnson', price: 320000, date: new Date() },
          ]);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching sales:', error);
        setIsLoading(false);
      }
    };

    if (date?.from && date?.to) {
      fetchSales();
    }
  }, [date]);

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting sales data...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recent Sales Report</h1>
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.property}</TableCell>
                    <TableCell>{sale.agent}</TableCell>
                    <TableCell>${sale.price.toLocaleString()}</TableCell>
                    <TableCell>{format(sale.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}