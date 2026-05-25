export function CAIFLogo({ className = "" }) {
  return (
    <div className="">
      <img
        src="/caif-logo.png"
        alt=""
        aria-hidden
        className={`object-cover h-30 object-center ${className}`}
      />
    </div>
  )
}
