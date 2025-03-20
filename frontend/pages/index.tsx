import dynamic from 'next/dynamic';

const SearchControls = dynamic(() => import('@/components/client/SearchControls'), {
  ssr: false,
});
const ToolForm = dynamic(() => import('@/components/client/ToolForm'), {
  ssr: false,
});
const ToolList = dynamic(() => import('@/components/client/ToolList'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">AI Tools</h1>
      <div className="mb-6">
        <SearchControls />
      </div>
      <div className="mb-6">
        <ToolForm />
      </div>
      <ToolList />
    </div>
  );
}
