/// <reference types="react" />
import { HeaderProps } from "@divops/component-header";
interface PageProps extends HeaderProps {
    className?: string;
    children: JSX.Element[] | JSX.Element | boolean | undefined | null;
    header?: ({ children }: {
        children: React.ReactNode;
    }) => JSX.Element;
}
export default function Page({ className, children, title, description, icon, header, }: PageProps): import("@emotion/react/jsx-runtime").JSX.Element;
export {};
