SELECT f1.id as "primaryFileId", f2.id as "secondaryFileId", f2."rootFolderId"
FROM public."File" f1
JOIN public."File" f2 on f1.hash = f2.hash
WHERE f1.id <> f2.id and f1."rootFolderId" = $1 and f2."rootFolderId" = ANY($2)
