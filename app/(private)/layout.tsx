import MainLayout from "@/components/layout/MainLayout";

type PrivateLayoutProps = {
    children: React.ReactNode;
};

export default function PrivateLayout({ children }: PrivateLayoutProps) {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}