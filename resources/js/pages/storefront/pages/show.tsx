import StorefrontLayout from '@/layouts/storefront-layout';
import { type CategoryWithCount } from '@/types';

interface ContentPage {
    id: number;
    title: string;
    slug: string;
    content: string;
    meta_description: string | null;
}

interface Props {
    page: ContentPage;
    categories: CategoryWithCount[];
}

export default function ShowPage({ page, categories }: Props) {
    return (
        <StorefrontLayout title={page.title} categories={categories}>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                        {page.title}
                    </h1>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl">
                        <div
                            className="prose prose-lg dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-strong:text-foreground max-w-none"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}
