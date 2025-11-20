import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Data {
  title: string | null;
  description: string;
  image: string | null;
}

interface DataProps {
  data: Data;
}

function Translucent({ data }: DataProps) {
  return (
    <Card className="bg-gradient-to-t from-transparent to-white/30 border-none hover:bg-white/15 transition-all duration-300 drop-shadow-xl">
      <CardContent>
        <CardHeader>
          {!data.image && (
            <CardTitle className="text-3xl md:text-4xl font-bold text-white text-center">
              {data.title}
            </CardTitle>
          )}
        </CardHeader>
        {data.image && (
          <div className="flex items-center justify-center">
            <img
              src={data.image}
              alt={data.title || ""}
              className="object-contain max-w-30"
            />
          </div>
        )}
        <p className="text-primary-foreground text-center text-md md:text-base font-extrabold w-full">
          {data.description}
        </p>
      </CardContent>
    </Card>
  );
}

export default Translucent;
