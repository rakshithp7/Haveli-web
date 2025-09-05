export default function ConfirmPage(props: any) {
  const id = props?.searchParams?.orderId || "";
  return (
    <div className="container-responsive py-16 text-center">
      <h1 className="text-2xl font-semibold">Thank you!</h1>
      <p className="mt-2 text-muted">Your order has been received.</p>
      {id && <p className="mt-4 text-sm">Order number: <span className="font-mono">{id}</span></p>}
      <p className="mt-6">We’re getting started and will notify you when it’s ready.</p>
    </div>
  );
}
