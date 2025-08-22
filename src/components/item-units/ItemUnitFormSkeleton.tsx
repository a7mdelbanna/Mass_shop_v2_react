
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ItemUnitFormSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle><Skeleton className="h-8 w-48" /></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="pt-4 flex justify-end space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemUnitFormSkeleton;
