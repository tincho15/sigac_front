import SolicitudDetalle from "@/components/solicitudes/SolicitudDetalle";

export const instant = false;

// El layout privado ya aplica MainLayout, la verificación de sesión y el
// <Suspense> necesario para leer el id con useParams.
// El backend restringe a los Funcionarios a las solicitudes que tienen asignadas.
export default function SolicitudDetallePage() {
    return <SolicitudDetalle />;
}
