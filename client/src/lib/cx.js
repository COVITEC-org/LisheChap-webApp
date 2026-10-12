/** Joins truthy class names: cx('a', cond && 'b', undefined) -> 'a b'. */
export function cx(...classNames) {
  return classNames.filter(Boolean).join(' ');
}
