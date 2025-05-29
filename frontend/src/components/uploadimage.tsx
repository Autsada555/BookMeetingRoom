import React from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';

type ImageUploadProps = {
    setData: React.Dispatch<React.SetStateAction<string[]>>;
};

export const ImageUpload: React.FC<ImageUploadProps> = ({ setData }) => {
    const [images, setImages] = React.useState<ImageListType>([]);
    const maxNumber = 10;

    const onChange = (imageList: ImageListType) => {
        setImages(imageList);
        setData(imageList.map(img => img.data_url || ""));
    };

    return (
        <div className="w-full border rounded-md p-4 bg-white shadow-sm">
            <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemove,
                    isDragging,
                    dragProps,
                }) => (
                    <div className="upload__image-wrapper">
                        <button
                            type="button"
                            className={`px-4 py-2 rounded font-semibold transition-colors duration-200 
                                ${isDragging ? "bg-blue-700 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                            onClick={onImageUpload}
                            {...dragProps}
                        >
                            {isDragging ? "ปล่อยเพื่ออัปโหลด" : "เลือกหรือวางรูปภาพที่นี่"}
                        </button>
                        <div className="flex gap-3 flex-wrap mt-4">
                            {imageList.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={image.data_url}
                                        alt=""
                                        className="w-28 h-28 object-cover rounded-lg border shadow"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => onImageRemove(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs opacity-80 group-hover:opacity-100 transition-opacity"
                                        title="ลบรูปนี้"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        {imageList.length > 0 && (
                            <div className="mt-3 text-sm text-gray-500">
                                อัปโหลดได้สูงสุด {maxNumber} รูป
                            </div>
                        )}
                    </div>
                )}
            </ImageUploading>
        </div>
    );
};