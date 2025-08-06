interface ImageContentProps {
  content: string;
  width: number;
  height: number;
}

export const ImageContent = ({ content, width, height }: ImageContentProps) => {
  return (
    <img
      src={content}
      alt="Note image"
      className="w-full h-full object-cover absolute inset-0"
    />
  );
};
