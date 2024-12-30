import { Disc3Icon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

type LoadingProps = React.ComponentPropsWithoutRef<typeof Disc3Icon>;

const Loading = ({ className, ...props }: LoadingProps) => {
  return (
    <Disc3Icon className={cn("size-4 animate-spin", className)} {...props} />
  );
};
Loading.displayName = "Loading";

export { Loading };
