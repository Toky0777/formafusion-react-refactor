export function Button({label, type})
{
    return <>
        <button type={type} className="px-4 py-2 bg-[#a462a4] text-white rounded-lg hover:bg-[#8d548d] transition-colors duration-200 text-sm">
            {label}
        </button>
    </>
}