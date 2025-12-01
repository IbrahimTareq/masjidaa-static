import ContactClient from "./contact";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
  return <ContactClient />;
}
