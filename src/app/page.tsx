import Select from "@/components/select";
import { users } from "@/data";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center md:p-24 p-4">
      <h1 className="my-9 font-bold text-5xl">Pick Users</h1>
      <Select
        options={users.map((user) => ({ label: user.name, value: user }))}
        placeholder="Select..."
      />
    </main>
  );
}
