import { useState } from "react";
import MenuContainer from "./MenuContainer";
function Prompt({ title, onSubmit }) {
    const [value, setValue] = useState("");
    const [isClosed, setIsClosed] = useState(false);
    function handleSubmit(e) {
        e.preventDefault();
        onSubmit?.(value);
        onClose?.();
    }
    if(isClosed) return;

    return (
        <MenuContainer onClose={()=>setIsClosed(true)}>
            <div className="prompt p-3 space-y-3">
                <div className="text-lg">{title}</div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        className="w-full border border-neutral-400 px-2 py-1 text-sm"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        autoFocus
                    />

                    <div className="flex justify-end gap-2 text-sm">
                        <button
                            type="button"
                            onClick={()=>setIsClosed(true)}
                            className="border border-neutral-400 px-2 py-1 hover:bg-neutral-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="border border-neutral-400 px-2 py-1 hover:bg-neutral-100"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </MenuContainer>
    );
}

export default Prompt;
