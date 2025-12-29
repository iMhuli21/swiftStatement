export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className='flex flex-col items-center'>
      <h3 className='text-lg font-semibold capitalize'>{title}</h3>
      <span className='opacity-50 text-sm'>{subtitle}</span>
    </div>
  );
}
