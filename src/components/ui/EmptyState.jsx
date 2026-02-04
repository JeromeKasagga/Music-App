// epmty state for the most recently played
import { Section } from "lucide-react";
import UploadButton from "./UploadButton";

function EmptyState() {
  return (
    <section className="mt-8">
        <div>
            <h1 className="font-bold text-lg ml-4">Most Listened</h1>
        </div>
      <div className="bg-secondary mt-2 flex flex-col items-center p-6 gap-6 rounded-3xl">
        <h1>Upload songs to get started</h1>
        <UploadButton />
      </div>
    </section>
  );
}

export default EmptyState;
