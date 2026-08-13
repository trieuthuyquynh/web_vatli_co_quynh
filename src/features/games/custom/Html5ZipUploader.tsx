import React, { useState } from 'react';
import JSZip from 'jszip';
import { Upload, FileArchive, CheckCircle2, AlertCircle, Play, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

interface Html5ZipUploaderProps {
  onUnpacked: (blobUrl: string, fileName: string, fileCount: number) => void;
}

export const Html5ZipUploader: React.FC<Html5ZipUploaderProps> = ({ onUnpacked }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successInfo, setSuccessInfo] = useState<{ count: number; name: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      setError('Vui lòng chọn đúng file định dạng .zip chứa Game HTML5!');
      return;
    }

    setLoading(true);
    setError('');
    setFileName(file.name);

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);
      
      const fileNames = Object.keys(loadedZip.files);
      let indexEntry = fileNames.find(n => n.toLowerCase().endsWith('index.html'));

      if (!indexEntry) {
        setError('Không tìm thấy file "index.html" trong thư mục gốc của file ZIP!');
        setLoading(false);
        return;
      }

      // Tạo Blob mapping cho các tài nguyên
      const blobMap: Record<string, string> = {};
      const pendingBlobs: Promise<void>[] = [];

      fileNames.forEach(name => {
        const fileObj = loadedZip.files[name];
        if (!fileObj.dir) {
          const p = fileObj.async('blob').then(blob => {
            let mimeType = 'text/plain';
            if (name.endsWith('.html')) mimeType = 'text/html';
            else if (name.endsWith('.css')) mimeType = 'text/css';
            else if (name.endsWith('.js')) mimeType = 'application/javascript';
            else if (name.endsWith('.png')) mimeType = 'image/png';
            else if (name.endsWith('.jpg') || name.endsWith('.jpeg')) mimeType = 'image/jpeg';
            else if (name.endsWith('.svg')) mimeType = 'image/svg+xml';
            else if (name.endsWith('.mp3')) mimeType = 'audio/mpeg';

            const typedBlob = new Blob([blob], { type: mimeType });
            blobMap[name] = URL.createObjectURL(typedBlob);
          });
          pendingBlobs.push(p);
        }
      });

      await Promise.all(pendingBlobs);

      // Đọc và rewrite index.html
      let htmlContent = await loadedZip.files[indexEntry].async('text');

      // Tự động chèn SDK Bridge PhysicsGame vào đầu thẻ <head> của game
      const sdkSnippet = `
        <script>
          window.PhysicsGame = {
            submitScore: function(score, maxScore, details) {
              window.parent.postMessage({
                type: 'PHYSICS_GAME_SCORE',
                score: score,
                maxScore: maxScore || 10,
                details: details || {}
              }, '*');
            }
          };
        </script>
      `;
      htmlContent = htmlContent.replace('<head>', '<head>' + sdkSnippet);

      // Thay thế các đường dẫn tương đối
      Object.keys(blobMap).forEach(resName => {
        const simpleName = resName.split('/').pop() || resName;
        htmlContent = htmlContent.split(resName).join(blobMap[resName]);
        htmlContent = htmlContent.split(simpleName).join(blobMap[resName]);
      });

      const finalHtmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const finalUrl = URL.createObjectURL(finalHtmlBlob);

      setSuccessInfo({
        count: fileNames.length,
        name: file.name
      });

      onUnpacked(finalUrl, file.name, fileNames.length);
    } catch (err: any) {
      console.error('Lỗi giải nén ZIP:', err);
      setError('Đã xảy ra lỗi khi đọc và giải nén file ZIP. Vui lòng kiểm tra lại cấu trúc file nén.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <FileArchive className="w-5 h-5 text-sky-600" />
        <span>Tải Lên Gói Game HTML5 (.ZIP)</span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Hệ thống hỗ trợ tự động giải nén và cô lập Sandbox các trò chơi viết bằng HTML5/Canvas/Construct/Phaser/Godot Web. Gói nén phải chứa file <strong className="text-slate-700">index.html</strong>.
      </p>

      {/* Upload Dropzone */}
      <div className="relative border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-6 text-center bg-white transition cursor-pointer">
        <input
          type="file"
          accept=".zip"
          onChange={handleFileUpload}
          disabled={loading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {loading ? (
          <LoadingSpinner text="Đang giải nén & nạp mã nguồn Game HTML5..." />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              {fileName ? fileName : 'Kéo thả hoặc Nhấp để chọn file .ZIP'}
            </span>
            <span className="text-[10px] text-slate-400">Hỗ trợ tối đa 50MB</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successInfo && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã giải nén thành công {successInfo.count} files từ {successInfo.name}!</span>
          </div>
          <span className="flex items-center gap-1 text-sky-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-[10px] font-black">
            <Sparkles className="w-3 h-3 text-sky-600" /> Sẵn sàng chạy
          </span>
        </div>
      )}
    </div>
  );
};
