export default function ApplicationLogo(props) {
    return (
        <div className={`flex items-center justify-center gap-4 ${props.className || ''}`}>
            <img src="/images/logo-kemenag.png" alt="Logo Kemenag" className="h-16 w-auto object-contain" />
            <img src="/images/logo-nurussalam.png" alt="Logo Nurussalam" className="h-16 w-auto object-contain" />
        </div>
    );
}
