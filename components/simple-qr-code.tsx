"use client"

interface SimpleQRCodeProps {
  value: string
  size?: number
}

export default function SimpleQRCode({ value, size = 200 }: SimpleQRCodeProps) {
  // This is a very simple visual representation, not an actual QR code
  return (
    <div className="bg-white p-4 rounded-lg" style={{ width: size, height: size }}>
      <div className="w-full h-full border-2 border-black p-2">
        <div className="grid grid-cols-5 grid-rows-5 w-full h-full gap-1">
          {/* QR code corner squares */}
          <div className="col-span-1 row-span-1 bg-black border-4 border-white"></div>
          <div className="col-start-5 col-span-1 row-span-1 bg-black border-4 border-white"></div>
          <div className="col-span-1 row-start-5 row-span-1 bg-black border-4 border-white"></div>

          {/* Random pattern to simulate QR code */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-black"
              style={{
                gridColumn: Math.floor(Math.random() * 5) + 1,
                gridRow: Math.floor(Math.random() * 5) + 1,
              }}
            ></div>
          ))}
        </div>
      </div>
      <div className="text-center text-xs mt-2 text-gray-500">Scan to open app</div>
    </div>
  )
}

