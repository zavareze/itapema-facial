export default function EnviarFotoVisitante({cpf, facial, setLoading, setResult}) {
    const handleUploadFile = (event) => {
        const img = document.createElement('img');
        img.onload = () => {
            const scale = 3200 / img.width < 1000 / img.height ? 3200 / img.width : 1000 / img.height;
            const dst = document.createElement("canvas");
            dst.width = img.width * scale;
            dst.height = img.height * scale;
            const ctx = dst.getContext("2d");
            ctx.drawImage(img, 0, 0, dst.width, dst.height);
            const body = { cpf, image: dst.toDataURL() };
            upload(body);
        }
        img.src = window.URL.createObjectURL(event.target.files[0]);
    }
    const upload = async (req) => {
        setLoading(true);
        const res = await fetch(`https://facial.parquedasaguas.com.br/visitante/store`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('token'),
          },
          body: JSON.stringify(req),
        });
        const result = await res.json();
        setLoading(false);
        if (result['status'] == 'success') {
            setResult(result);
        } else
            if (result.status == 'fail') {
                alert(result.message);
            }

    }

    return (<div className="col-span-2 grid grid-cols-2 gap-x-2">
        {facial != '1' ? <div className="text-center font-bold text-red-500 col-span-2">
            Envie sua foto para atualizar seu cadastro
        </div> : ''}
        <button
            className="btn-responsive bg-emerald-500 dark:bg-emerald-600 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
        >
            <input type="file" name="image" id="upload" accept="image/*" capture="user" onChange={handleUploadFile}></input>
            Foto Câmera
        </button>
        <button
            className="btn-responsive bg-emerald-500 dark:bg-emerald-600 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
        >
            <input type="file" name="image2" id="upload2" accept="image/*" onChange={handleUploadFile}></input>
            Procurar na Galeria
        </button></div>);
}