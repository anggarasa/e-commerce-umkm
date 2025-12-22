import InputError from '@/components/common/input-error';
import TextLink from '@/components/common/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout
            title="Selamat Datang Kembali"
            description="Masuk ke akun Anda untuk melanjutkan"
        >
            <Head title="Masuk" />

            {status && (
                <div className="mb-4 rounded-lg border border-success/20 bg-success/10 p-3 text-center text-sm font-medium text-success">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="nama@perusahaan.com"
                                    aria-invalid={!!errors.email}
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-medium text-primary hover:text-primary/80"
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    aria-invalid={!!errors.password}
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm text-muted-foreground select-none"
                                >
                                    Ingat saya selama 30 hari
                                </Label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            size="lg"
                            className="mt-2 w-full"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing ? (
                                <>
                                    <Spinner className="size-4" />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                'Masuk'
                            )}
                        </Button>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
