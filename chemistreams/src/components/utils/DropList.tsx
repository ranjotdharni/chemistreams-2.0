import { DropListProps } from "@/lib/types/client"

export default function DropList<T>({ open, TitleComponent, items, render, containerTailwind } : DropListProps<T>) {

    return (
        <div className={containerTailwind}>
            {
                TitleComponent
            }
            
            <ul className="rounded p-2" style={{display: open ? "block" : "none", overflow: "hidden", backgroundColor: "var(--color-black)", border: "solid 1px var(--color-dark-grey)"}}>
                {
                    items.map((item, index) => {
                        return render(item, index)
                    })
                }
            </ul>
        </div>
    )
}
