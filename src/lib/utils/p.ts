function p(path: string) {
  return process.env.NODE_ENV === 'development' ? `/${path}` : `/exams/${path}`;
}

export default p;
