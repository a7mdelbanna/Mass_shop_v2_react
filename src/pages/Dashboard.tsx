import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { ArrowUpRight, Package, ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchOrders } from '@/services/order-service';
import { fetchProducts } from '@/services/product-service';
import { CustomerService } from '@/services/customer-service';
import { useTranslation } from 'react-i18next';

const MAX_PAGE_SIZE = 500; // For demo/performance, adjust as needed

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = React.useState<{
    totalRevenue: number;
    productsCount: number;
    customersCount: number;
    newProductsThisWeek: number;
    salesCount: number;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        // 1. Fetch all orders (paginated)
        let allOrders: any[] = [];
        let page = 1, hasMore = true;
        while (hasMore && page <= 5) { // up to 2500 orders max
          const res = await fetchOrders('1', { page, pageSize: MAX_PAGE_SIZE });
          allOrders = allOrders.concat(res.data);
          hasMore = res.data.length === MAX_PAGE_SIZE;
          page++;
        }
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.orderEznNetValue || 0), 0);
        const salesCount = allOrders.length;

        // 2. Fetch all products (paginated)
        let allProducts: any[] = [];
        page = 1; hasMore = true;
        while (hasMore && page <= 5) { // up to 2500 products max
          const res = await fetchProducts({ page, pageSize: MAX_PAGE_SIZE });
          allProducts = allProducts.concat(res.data);
          hasMore = res.data.length === MAX_PAGE_SIZE;
          page++;
        }
        const productsCount = allProducts.length;
        // No createdAtDate field, so we cannot calculate new products this week
        const newProductsThisWeek = 0; // TODO: Add createdAtDate to product model to enable this

        // 3. Fetch all customers (paginated)
        let allCustomers: any[] = [];
        page = 1; hasMore = true;
        while (hasMore && page <= 5) { // up to 2500 customers max
          const res = await CustomerService.getAll(page, MAX_PAGE_SIZE);
          allCustomers = allCustomers.concat(res.data);
          hasMore = res.data.length === MAX_PAGE_SIZE;
          page++;
        }
        const customersCount = allCustomers.length;

        setStats({ totalRevenue, productsCount, customersCount, newProductsThisWeek, salesCount });
      } catch (error) {
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  // Sample data for charts
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ];

  const productPerformance = [
    { name: 'Laptops', value: 35 },
    { name: 'Phones', value: 28 },
    { name: 'Tablets', value: 15 },
    { name: 'Accessories', value: 22 },
  ];

  if (loading || !stats) {
    return <div className="p-8 text-center text-muted-foreground">{t('dashboardLoading')}</div>;
  }

  const cards = [
    {
      title: t('dashboardTotalRevenue'),
      value: stats.totalRevenue.toFixed(2),
      change: t('dashboardChangeRevenue'),
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-blue-500/90',
      description: t('dashboardAllSalesThisMonth')
    },
    {
      title: t('dashboardProducts'),
      value: stats.productsCount,
      change: t('dashboardChangeProducts', { count: stats.newProductsThisWeek }),
      icon: <Package className="h-5 w-5" />,
      color: 'bg-green-500/90',
      description: t('dashboardActiveInventory')
    },
    {
      title: t('dashboardCustomers'),
      value: stats.customersCount,
      change: t('dashboardChangeCustomers'),
      icon: <Users className="h-5 w-5" />,
      color: 'bg-purple-500/90',
      description: t('dashboardRegisteredAccounts')
    },
    {
      title: t('dashboardSales'),
      value: stats.salesCount,
      change: t('dashboardChangeSales'),
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-amber-500/90',
      description: t('dashboardCompletedOrders')
    },
  ];

  return (
    <div className="space-y-8 w-full px-2 sm:px-4 md:px-8 py-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow border-opacity-40 min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {card.description}
                </CardDescription>
              </div>
              <div className={cn("p-2 rounded-lg text-white", card.color)}>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{card.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-2 font-medium">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                {card.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow border-opacity-40 min-w-0">
          <CardHeader>
            <CardTitle>{t('dashboardMonthlyRevenue')}</CardTitle>
            <CardDescription>{t('dashboardMonthlyRevenueDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 25,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow border-opacity-40 min-w-0">
          <CardHeader>
            <CardTitle>{t('dashboardProductPerformance')}</CardTitle>
            <CardDescription>{t('dashboardProductPerformanceDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productPerformance}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 25,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
