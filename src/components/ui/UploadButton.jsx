// button to upload songs
import { Upload } from "lucide-react";

function UploadButton() {
    return(
         <button className="flex items-center gap-2 bg-white text-secondary px-5 py-2 font-medium rounded-full">
              <Upload className="fill-secondary w-4 h-4" />
              <span>UPLOAD</span>
            </button>
    );
}

export default UploadButton;