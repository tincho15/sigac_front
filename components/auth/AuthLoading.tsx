
export default function AuthLoading() {
    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50"
            role="status"
            aria-live="polite"
        >
            <h1 className="text-3xl font-semibold tracking-[0.15em] text-blue-950">
                SIGAC
            </h1>

            <div
                className="h-9 w-9 animate-spin rounded-full border-[3px] border-gray-200 border-t-blue-900"
                aria-hidden="true"
            />

            <p className="text-sm text-gray-500">
                Cargando...
            </p>
        </div>
    );
}
