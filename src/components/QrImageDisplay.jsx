import { QRCodeSVG } from 'qrcode.react';

export default function QrImageDisplay({ token, size = 200 }) {
  if (!token) return null;
  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="bg-white p-4 rounded-2xl border-2 border-blue-100 shadow-sm">
        <QRCodeSVG
          value={token}
          size={size}
          level="M"
          includeMargin={true}
        />
      </div>
    </div>
  );
}
