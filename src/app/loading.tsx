export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFFDF5]">
      <div className="text-center">
        <div className="text-6xl animate-bounce mb-4">
          <span role="img" aria-label="토끼">&#128048;</span>
        </div>
        <p className="text-gray-400 font-[Gaegu] text-lg animate-pulse">
          행운을 불러오는 중...
        </p>
      </div>
    </main>
  );
}
