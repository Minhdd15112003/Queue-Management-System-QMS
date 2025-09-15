package common

import "iter"

func Filter[T any](slice []T, predicate func(T) bool) iter.Seq[T] {
	return func(yield func(T) bool) {
		for _, v := range slice {
			if predicate(v) {
				if !yield(v) {
					return
				}
			}
		}
	}
}
