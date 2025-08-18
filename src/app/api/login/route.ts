import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const apiRes = await fetch(`${process.env.BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(data, { status: apiRes.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Login API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
