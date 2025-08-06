export const getImageFromClipboard = async (): Promise<string | null> => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    
    for (const clipboardItem of clipboardItems) {
      const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
      
      if (imageTypes.length > 0) {
        const imageType = imageTypes[0];
        const blob = await clipboardItem.getType(imageType);
        
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to read clipboard:', error);
    return null;
  }
};

export const isImageInClipboard = async (): Promise<boolean> => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    return clipboardItems.some(item => 
      item.types.some(type => type.startsWith('image/'))
    );
  } catch (error) {
    return false;
  }
};

export const getImageAspectRatio = (base64Image: string): Promise<number> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      resolve(aspectRatio);
    };
    img.onerror = () => {
      resolve(1); // Default to square if image fails to load
    };
    img.src = base64Image;
  });
};