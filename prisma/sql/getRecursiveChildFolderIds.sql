WITH RECURSIVE nested_folders(id)
AS(
	SELECT id FROM public."Folder" WHERE "parentFolderId"=$1
	UNION ALL
    SELECT fd.id FROM public."Folder" fd INNER JOIN nested_folders cte ON fd."parentFolderId" = cte."id"
)
SELECT * FROM nested_folders;