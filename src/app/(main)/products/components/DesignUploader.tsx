"use client";

import { useEffect, useRef, useState } from "react";
import { AiFillFile } from "react-icons/ai";
import { PAPER_RATIO } from "../configuration/previewSizes";
import { FaXmark } from "react-icons/fa6";
import type { ProductDesign } from "../configuration/types";

type Props = {
	product: string | null;
	selectedSizes?: string | null;
	widthFt?: number | null;
	heightFt?: number | null;
	files: ProductDesign[];
	sides: string[];
	finishingOptions: string[];
	onFilesChange: (files: ProductDesign[]) => void;
};

function norm(product: string | null) {
	return product?.toLocaleLowerCase().trim() ?? "";
}

function getRatio(
	product: string | null,
	selectedSizes?: string | null,
	widthFt?: number | null,
	heightFt?: number | null,
): [number, number] {
	const p = norm(product);

	if (
		(p === "banner" || p === "banners" || p === "stickers & labels") &&
		widthFt &&
		heightFt
	) {
		return [widthFt, heightFt];
	}

	if (selectedSizes && PAPER_RATIO[selectedSizes]) {
		return PAPER_RATIO[selectedSizes];
	}

	if (p.startsWith("flier")) return [148, 210];
	if (p == "banners") return [3, 2];
	if (p == "stickers & labels") return [1, 1];
	if (p === "shirt printing") return [4, 5];
	if (p == "award") return [297, 210];
	if (p.startsWith("broch")) return [210, 297];
	return [85, 55];
}

const DesignUploader = ({
	product,
	selectedSizes,
	widthFt,
	heightFt,
	files,
	sides,
	finishingOptions,
	onFilesChange,
}: Props) => {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
	const inputRef = useRef<HTMLInputElement>(null);
	const ratio = getRatio(product, selectedSizes, widthFt, heightFt);
	const activeFile = files.find((f) => f.id === activeId) || files[0];

	useEffect(() => {
		const urls = Object.fromEntries(
			files.flatMap((design) =>
				design.file ? [[design.id, URL.createObjectURL(design.file)]] : [],
			),
		);
		setPreviewUrls(urls);
		return () => Object.values(urls).forEach(URL.revokeObjectURL);
	}, [files]);

	const handleFiles = (incoming: FileList) => {
		const updated: ProductDesign[] = [...files];
		Array.from(incoming).forEach((file) => {
			updated.push({
				id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
				file,
				fileName: file.name,
				side:
					sides.find((candidate) =>
						updated.every((existing) => existing.side !== candidate),
					) ??
					sides[0] ??
					"front",
				lamination: null,
			});
		});

		onFilesChange(updated);
		if (!activeId && updated[0]) setActiveId(updated[0].id);
	};

	const removeFile = (id: string) => {
		const updated = files.filter((f) => f.id !== id);
		onFilesChange(updated);
		if (activeId === id) setActiveId(updated[0]?.id || null);
	};

	const updateDesign = (id: string, changes: Partial<ProductDesign>) => {
		onFilesChange(
			files.map((design) =>
				design.id === id ? { ...design, ...changes } : design,
			),
		);
	};
	return (
		<div className="mt-4">
			<h3 className="font-bold text-center text-[#0B3D2E] text-[15px]">
				Upload Design for {product ?? "product"}
			</h3>
			<p className="text-xs text-center text-gray-500 mb-2">
				{selectedSizes
					? `Size: ${selectedSizes}`
					: widthFt && heightFt
						? `Size: ${widthFt}ft x ${heightFt}`
						: "select size for correct preview"}
			</p>

			<p className="text-[10px] font-bold text-center text-green-900">
				{activeFile ? `${activeFile.side.toUpperCase()} SIDE` : "FRONT SIDE"}
				<br />
				Preview
			</p>

			<div
				className={`w-70 mx-auto relative bg-green-300 border-2 border-green-800 border-dashed flex items-center justify-center cursor-pointer overflow-hidden`}
				style={{ aspectRatio: `${ratio[0]} / ${ratio[1]}` }}
				onClick={() => inputRef.current?.click()}
			>
				{activeFile?.file && activeFile.file.type.startsWith("image/") ? (
					<img
						src={previewUrls[activeFile.id]}
						className="w-full h-full object-contain"
						alt={`${activeFile.side} design preview`}
					/>
				) : activeFile ? (
					<div className="text-center  mx-auto">
						<p className="text-4xl">
							<AiFillFile />
						</p>
						<p className="text-sm text-green-900">{activeFile.fileName}</p>
					</div>
				) : (
					<div className="text-center text-green-900 flex flex-col justify-center items-center">
						<p className="text-4xl">
							<AiFillFile />
						</p>
						<p>Choose files</p>
					</div>
				)}
			</div>

			{/** Thumbnails */}

			<div className="flex gap-2 mt-3 flex-wrap items-start ">
				{files.map((f) => (
					<div
						key={f.id}
						onClick={() => setActiveId(f.id)}
						className={`relative w-32 border-2 rounded-lg overflow-hidden cursor-pointer bg-green-300 p-1 ${f.id === activeId ? "border-green-800" : "border-green-400"}`}
					>
						{f.file && f.file.type.startsWith("image/") ? (
							<img
								src={previewUrls[f.id]}
								alt={`${f.side} design`}
								className="w-full h-14 object-contain"
							/>
						) : (
							<div
								className="h-14 flex items-center justify-center"
								aria-label="PDF file"
							>
								<AiFillFile />
							</div>
						)}
						{(sides.length > 1 || finishingOptions.length > 0) && (
							<div className="mt-1 flex flex-col gap-1">
								{sides.length > 1 && (
									<select
										aria-label={`Side for ${f.fileName}`}
										className="w-full rounded border p-1 text-[10px] text-2xl text-green-900"
										value={f.side}
										onClick={(event) => event.stopPropagation()}
										onChange={(event) => updateDesign(f.id, { side: event.target.value })}
									>
										{sides.map((side) => (
											<option key={side} value={side}>
												{side}
											</option>
										))}
									</select>
								)}
								{finishingOptions.length > 0 && (
									<select
										aria-label={`Finishing for ${f.fileName}`}
										className="w-full rounded border p-1 text-[10px] text-green-900"
										value={f.lamination ?? ""}
										onClick={(event) => event.stopPropagation()}
										onChange={(event) =>
											updateDesign(f.id, {
												lamination: event.target.value || null,
											})
										}
									>
										<option value="">No finishing</option>
										{finishingOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
								)}
							</div>
						)}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								removeFile(f.id);
							}}
							className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1"
							aria-label={`Remove ${f.fileName}`}
						>
							<FaXmark />
						</button>
					</div>
				))}

				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="border px-3 py-1 text-xs rounded bg-green-500 text-green-900"
				>
					+ Add more +
				</button>
			</div>

			{/** File names */}
			<div className="text-[11px] mt-2 space-y-1 text-green-700">
				{files.map((f) => (
					<p key={f.id}>
						{f.side.toUpperCase()}: {f.fileName}
						{f.lamination ? ` · ${f.lamination}` : ""}
					</p>
				))}
			</div>

			<input
				ref={inputRef}
				type="file"
				accept="image/*, .pdf"
				multiple
				hidden
				onChange={(e) => {
					if (e.target.files) handleFiles(e.target.files);
					e.target.value = "";
				}}
			/>
		</div>
	);
};

export default DesignUploader;
