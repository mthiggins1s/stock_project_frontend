import { HttpInterceptorFn } from '@angular/common/http';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    console.log('🔑 Attaching token to request:', token, req.url);
    return next(authReq);
  }

  console.log('⚠️ No token found for request:', req.url);
  return next(req);
};
