import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CharacterCardProps {
  type: string;
  bgColor: string;
  description: string;
  image?: string;
}

export function CharacterCard({ type, bgColor, description, image }: CharacterCardProps) {
  return (
    <div className="bg-white rounded-[23px]">
      {/* Character Image Area */}
      <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: bgColor }}>
        <ImageWithFallback
          src={image || "https://images.unsplash.com/photo-1620568578900-a0cf51e83c38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2FydG9vbiUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjIxNTE0ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
          alt="Character"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Card Content */}
      <div className="flex flex-col items-center" style={{ padding: '15px 0' }}>
        <Badge
          className="mb-2"
          style={{ backgroundColor: bgColor, borderRadius: '20px', paddingLeft: '15px', paddingRight: '15px' }}
        >
          {type}
        </Badge>
        <p className="text-xs text-gray-600 leading-relaxed text-justify line-clamp-3 short-desc" style={{ fontSize: '11px' }} dangerouslySetInnerHTML={{ __html: description.replace(/\r\n/g, '<br>') }}>
        </p>
      </div>
    </div>
  );
}
