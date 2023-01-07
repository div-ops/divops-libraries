/// <reference types="react" />
export interface HeaderProps {
    title?: string;
    description?: string;
    icon?: string;
    as?: ({ children }: {
        children: React.ReactNode;
    }) => JSX.Element;
}
export default function Header({ title, description, icon, as, }: HeaderProps): import("@emotion/react/jsx-runtime").JSX.Element | null;
