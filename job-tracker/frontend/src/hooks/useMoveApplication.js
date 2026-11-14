import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";

export function useMoveApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, position }) =>
      api.patch(`/applications/${id}/move`, { status, position }),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ["applications"] });
      const prev = qc.getQueryData(["applications"]);
      qc.setQueryData(["applications"], (old) =>
        old.map((a) => a.id === vars.id
          ? { ...a, status: vars.status, position: vars.position } : a));
      return { prev };
    },
    onError: (_err, _vars, ctx) => qc.setQueryData(["applications"], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}