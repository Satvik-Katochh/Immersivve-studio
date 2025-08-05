import { useState, useCallback } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Download } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { ColorPalette } from "@/components/ColorPalette";
import { ProcessingStates } from "@/components/ProcessingStates";
import { apiService, type Mask } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AppState {
  uploadedImage: File | null;
  imagePreview: string | null;
  masks: Mask[];
  selectedMasks: number[];
  appliedColors: Map<number, string>;
  isProcessing: boolean;
  progress: number;
  error: string | null;
  currentStep: "upload" | "select" | "color" | "download";
}

function App() {
  const [state, setState] = useState<AppState>({
    uploadedImage: null,
    imagePreview: null,
    masks: [],
    selectedMasks: [],
    appliedColors: new Map(),
    isProcessing: false,
    progress: 0,
    error: null,
    currentStep: "upload",
  });

  const { toast } = useToast();

  const handleImageUpload = useCallback(
    async (file: File, preview: string) => {
      setState((prev) => ({
        ...prev,
        uploadedImage: file,
        imagePreview: preview,
        isProcessing: true,
        progress: 0,
        error: null,
        currentStep: "select",
      }));

      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          setState((prev) => ({ ...prev, progress: i }));
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Upload to backend
        const uploadResponse = await apiService.uploadImage(file);

        if (uploadResponse.success) {
          toast({
            title: "Image uploaded successfully",
            description: "Your image is ready for processing.",
          });
          setState((prev) => ({
            ...prev,
            isProcessing: false,
            progress: 100,
          }));
        } else {
          throw new Error(uploadResponse.message || "Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error: error instanceof Error ? error.message : "Upload failed",
        }));
        toast({
          title: "Upload failed",
          description:
            error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleCanvasClick = useCallback(
    async (x: number, y: number) => {
      if (!state.uploadedImage || state.isProcessing) return;

      setState((prev) => ({
        ...prev,
        isProcessing: true,
        progress: 0,
        error: null,
      }));

      try {
        // Simulate processing progress
        for (let i = 0; i <= 100; i += 20) {
          setState((prev) => ({ ...prev, progress: i }));
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        const response = await apiService.generateMasks(state.uploadedImage, [
          [x, y],
        ]);

        if (response.success) {
          const newMask: Mask = {
            id: Date.now(), // Generate unique ID
            coordinates: response.masks[0]?.coordinates || [],
            color: undefined,
          };

          setState((prev) => ({
            ...prev,
            masks: [...prev.masks, newMask],
            isProcessing: false,
            progress: 100,
            currentStep: "color",
          }));

          toast({
            title: "Mask generated successfully",
            description: "Click on the mask to apply colors.",
          });
        } else {
          throw new Error(response.message || "Mask generation failed");
        }
      } catch (error) {
        console.error("Mask generation error:", error);
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error:
            error instanceof Error ? error.message : "Mask generation failed",
        }));
        toast({
          title: "Mask generation failed",
          description:
            error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      }
    },
    [state.uploadedImage, state.isProcessing, toast]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      if (state.selectedMasks.length === 0) {
        toast({
          title: "No mask selected",
          description: "Click on a mask to select it for coloring.",
          variant: "destructive",
        });
        return;
      }

      setState((prev) => {
        const newAppliedColors = new Map(prev.appliedColors);
        state.selectedMasks.forEach((maskId) => {
          newAppliedColors.set(maskId, color);
        });

        return {
          ...prev,
          appliedColors: newAppliedColors,
          currentStep: "download",
        };
      });

      toast({
        title: "Color applied",
        description: `Applied ${color} to selected mask(s).`,
      });
    },
    [state.selectedMasks, toast]
  );

  const handleMaskSelect = useCallback((maskId: number) => {
    setState((prev) => ({
      ...prev,
      selectedMasks: prev.selectedMasks.includes(maskId)
        ? prev.selectedMasks.filter((id) => id !== maskId)
        : [...prev.selectedMasks, maskId],
    }));
  }, []);

  const handleDownload = useCallback(async () => {
    if (state.appliedColors.size === 0) {
      toast({
        title: "No colors applied",
        description: "Apply colors to masks before downloading.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate download
      toast({
        title: "Download started",
        description: "Preparing your colored image...",
      });

      // In a real implementation, you would call the download API
      // const blob = await apiService.downloadResult(filename)
      // const url = URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = 'building-segmentation.png'
      // a.click()

      toast({
        title: "Download complete",
        description: "Your colored building segmentation has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  }, [state.appliedColors, toast]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <h1 className="text-xl font-bold">Building Segmentation</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upload and Processing */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Upload */}
              <ImageUpload
                onImageUpload={handleImageUpload}
                isProcessing={state.isProcessing}
              />

              {/* Processing States */}
              <ProcessingStates
                isProcessing={state.isProcessing}
                progress={state.progress}
                status={state.currentStep}
                error={state.error}
                masksGenerated={state.masks.length}
              />

              {/* Canvas Area */}
              {state.imagePreview && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Building Canvas
                  </h3>
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={state.imagePreview}
                      alt="Building"
                      className="w-full h-full object-cover cursor-crosshair"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        handleCanvasClick(x, y);
                      }}
                    />
                    {/* Mask overlays would be rendered here */}
                    {state.masks.map((mask) => (
                      <div
                        key={mask.id}
                        className={`absolute inset-0 ${
                          state.selectedMasks.includes(mask.id)
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        style={{
                          backgroundColor: mask.color || "transparent",
                          opacity: mask.color ? 0.3 : 0,
                        }}
                        onClick={() => handleMaskSelect(mask.id)}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click on building sections to generate masks, then click on
                    masks to select them for coloring.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Color Palette and Download */}
            <div className="space-y-8">
              {/* Color Palette */}
              <ColorPalette
                onColorSelect={handleColorSelect}
                disabled={state.selectedMasks.length === 0}
              />

              {/* Download Section */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Download Result</span>
                </h3>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {state.appliedColors.size > 0
                      ? `${state.appliedColors.size} color${
                          state.appliedColors.size !== 1 ? "s" : ""
                        } applied`
                      : "Apply colors to download"}
                  </div>
                  <Button
                    onClick={handleDownload}
                    disabled={state.appliedColors.size === 0}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              </div>

              {/* Status Summary */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Image uploaded:</span>
                    <Badge
                      variant={state.uploadedImage ? "default" : "secondary"}
                    >
                      {state.uploadedImage ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Masks generated:</span>
                    <Badge variant="default">{state.masks.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Colors applied:</span>
                    <Badge variant="default">{state.appliedColors.size}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Current step:</span>
                    <Badge variant="secondary" className="capitalize">
                      {state.currentStep}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
