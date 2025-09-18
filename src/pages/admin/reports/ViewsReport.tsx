import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const propertyViews = [
	{ property: 'Luxury Villa Runda', views: 1245, inquiries: 23, conversion: '1.8%' },
	{ property: 'Modern Apartment CBD', views: 987, inquiries: 18, conversion: '1.8%' },
	{ property: 'Family Home Karen', views: 856, inquiries: 15, conversion: '1.8%' },
	{ property: 'Studio Westlands', views: 743, inquiries: 12, conversion: '1.6%' },
	{ property: 'Townhouse Lavington', views: 632, inquiries: 9, conversion: '1.4%' }
];

const ViewsReport = () => (
	<AdminLayout>
		<h1 className="text-2xl font-bold mb-4">Property Views & Conversions</h1>
		<Card>
			<CardHeader>
				<CardTitle>Property Views & Conversions</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Property</TableHead>
							<TableHead>Views</TableHead>
							<TableHead>Inquiries</TableHead>
							<TableHead>Conversion</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{propertyViews.map((property, index) => (
							<TableRow key={index}>
								<TableCell className="font-medium">{property.property}</TableCell>
								<TableCell>{property.views.toLocaleString()}</TableCell>
								<TableCell>{property.inquiries}</TableCell>
								<TableCell>
									<Badge variant="outline">{property.conversion}</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	</AdminLayout>
);

export default ViewsReport;