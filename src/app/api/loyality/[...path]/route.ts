import { tableCrmApi } from "@/shared/api/clients";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// ✅ Серверный прокси для обхода CORS блокировки
// Все запросы на /api/loyality/* будут перенаправлены на tableCrmApi
// Сохраняются методы, заголовки, тело запроса, query параметры

const API_BASE_PATH = "/api/loyality";

async function handler(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace(API_BASE_PATH, "");

    // Копируем все заголовки кроме хоста
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (!["host", "referer", "origin"].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    // Копируем query параметры
    const params = Object.fromEntries(url.searchParams.entries());

    // Конвертируем Headers в простой объект для Axios
    const headersObject: Record<string, string> = {};
    headers.forEach((value, key) => {
      headersObject[key] = value;
    });

    let response;

    if (request.method === "GET") {
      response = await tableCrmApi.get(path, {
        params,
        headers: headersObject,
      });
    } else if (request.method === "POST") {
      const body = await request.json();
      response = await tableCrmApi.post(path, body, {
        headers: headersObject,
      });
    } else if (request.method === "PUT") {
      const body = await request.json();
      response = await tableCrmApi.put(path, body, {
        headers: headersObject,
      });
    } else if (request.method === "DELETE") {
      response = await tableCrmApi.delete(path, {
        headers: headersObject,
      });
    } else {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 },
      );
    }

    console.log(response.status);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    let statusCode = 500;
    let responseData = { error: "Internal Server Error" };

    // Проверяем тип ошибки Axios
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: unknown;
        };
        message?: string;
      };

      if (axiosError.response) {
        statusCode = axiosError.response.status || 500;
        responseData =
          (axiosError.response.data as typeof responseData) || responseData;
      }

      console.error(axiosError.response?.data || axiosError.message);
    } else {
      console.error(error instanceof Error ? error.message : "Unknown error");
    }

    return NextResponse.json(responseData, { status: statusCode });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
