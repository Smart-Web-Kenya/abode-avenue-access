import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const topPerformers = [
	{ name: 'Mike Wilson', sales: 15, revenue: 3200000 },
	{ name: 'Jane Smith', sales: 12, revenue: 2800000 },
	{ name: 'John Doe', sales: 10, revenue: 2100000 },
];

const AgentsReport = () => (
	<AdminLayout>
		<h1 className="text-2xl font-bold mb-4">Top Performing Agents</h1>
		<Card>
			<CardHeader>
				<CardTitle>Top Performing Agents</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Rank</TableHead>
							<TableHead>Agent</TableHead>
							<TableHead>Sales</TableHead>
							<TableHead>Revenue</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{topPerformers.map((performer, index) => (
							<TableRow key={performer.name}>
								<TableCell>
									<Badge className="bg-brand-green/10 text-brand-green">
										#{index + 1}
									</Badge>
								</TableCell>
								<TableCell className="font-medium">
									{performer.name}
								</TableCell>
								<TableCell>{performer.sales}</TableCell>
								<TableCell className="font-bold">
									$
									{performer.revenue.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	</AdminLayout>
);

export default AgentsReport;