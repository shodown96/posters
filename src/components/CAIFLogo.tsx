export function CAIFLogo({ className = "" }) {
  return (
    <div className="">
      <img
        src="/caif-logo-mark.png"
        alt=""
        aria-hidden
        className={`object-cover h-40 object-center ${className}`}
      />
    </div>
  )
}
