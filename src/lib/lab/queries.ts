import { queryOptions } from '@tanstack/react-query';
import { getPublicLab } from './server.functions';
export const labQuery = queryOptions({ queryKey:['lab'], queryFn:()=>getPublicLab(), staleTime:30000 });
