'use client';
import { useRouter } from 'next/navigation';
import { FaChevronLeft } from 'react-icons/fa';

export function Header({ title }: { title: string }) {
    const router = useRouter();

    return (
        <header className="relative flex items-center justify-center p-4 bg-light-background">
            <button
                onClick={() => router.back()}
                className="absolute left-4 text-dark-text"
                aria-label="Go back"
            >
                <FaChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-dark-text">{title}</h1>
        </header>
    );
}