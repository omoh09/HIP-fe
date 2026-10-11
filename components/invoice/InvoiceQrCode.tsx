import { useMemo } from "react";
import { buildQrMatrix } from "@/lib/qr/invoiceQr";

type Props = {
  url?: string;
  size?: number;
  showLabel?: boolean;
  className?: string;
};

export default function InvoiceQrCode({
  url = "",
  size = 116,
  showLabel = true,
  className = "",
}: Props) {
  const matrix = useMemo(() => buildQrMatrix(url), [url]);

  if (!matrix || !url) return null;

  const quietZone = 4;
  const viewBoxSize = matrix.moduleCount + quietZone * 2;

  return (
    <div className={`inline-flex flex-col items-center ${className}`.trim()}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        role="img"
        aria-label="QR code for this invoice's secure client page"
        shapeRendering="crispEdges"
        className="rounded-md bg-white"
      >
        <rect width={viewBoxSize} height={viewBoxSize} fill="#ffffff" />
        {matrix.modules.map((row, rowIndex) =>
          row.map((dark, colIndex) =>
            dark ? (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex + quietZone}
                y={rowIndex + quietZone}
                width="1"
                height="1"
                fill="#020617"
              />
            ) : null,
          ),
        )}
      </svg>
      {showLabel && (
        <div className="mt-2 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700">
            Scan to view &amp; pay
          </p>
          <p className="mt-0.5 text-[9px] text-slate-400">Secure client invoice link</p>
        </div>
      )}
    </div>
  );
}
